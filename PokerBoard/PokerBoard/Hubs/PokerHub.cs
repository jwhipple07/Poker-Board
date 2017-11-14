using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Threading.Tasks;
using PokerBoard.Models;

namespace PokerBoard.Hubs
{
    public class PokerHub : Hub
    {
        public static List<UserModel> ConnectedUsers = new List<UserModel>();
        public void Send(string roomID, string vote)
        {
            try
            {
                RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
                string prevVote = rm.roomUsers.First(x => x.connectionID == Context.ConnectionId).vote;
                rm.roomUsers.First(x => x.connectionID == Context.ConnectionId).vote = vote;
                rm.roomUsers.First(x => x.connectionID == Context.ConnectionId).prevVote = prevVote;
                if(prevVote != null)
                {
                    rm.currentStory.poll[prevVote]--;
                }
                rm.currentStory.poll[vote]++;


                rm.roomMessage = "Vote";
                var data = JsonConvert.SerializeObject(rm);
                Clients.Group(roomID).onPageUpdate(data);

                UserModel um = rm.roomUsers.First(x => x.connectionID == Context.ConnectionId);
                data = JsonConvert.SerializeObject(um);
                Clients.Caller.selfUpdate(data);

            } catch(Exception e)
            {
                Clients.Caller.onSendError(e.Message);
            }
        }


        public void Connect(string roomID)
        {

            var id = Context.ConnectionId;
            var userName = Context.User.Identity.Name;//HttpContext.Current.Session.SessionID;

            if (ConnectedUsers.Count(x => x.connectionID == id) == 0)
            {
                ConnectedUsers.Add(new UserModel { connectionID = id, name = userName});
            }
            RoomModel rm = JoinRoom(roomID);

            // send to all except caller client
            string data = JsonConvert.SerializeObject(rm);

            Clients.Group(roomID).onPageUpdate(data);
            // send to caller
            Clients.Caller.onPageUpdate(data);

        }
        public void BecomeAModerator(string password, string roomID)
        {
            RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
            string decryptedPassword = EncryptDecrypt.Decrypt(rm.ModeratorPassword);
            if(decryptedPassword == password)
            {
                UserModel um = rm.roomUsers.First(x => x.connectionID == Context.ConnectionId);
                um.isModerator = true;
                rm.roomMessage = um.name + " has become a moderator";


                string data = JsonConvert.SerializeObject(rm);
                Clients.Group(roomID).onPageUpdate(data);
                //update caller's state information
                data = JsonConvert.SerializeObject(um);
                Clients.Caller.selfUpdate(data);
            }

        }

        public void UpdateRoomState(int state, string roomID)
        {
            RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
            rm.roomState = state;

            string data = JsonConvert.SerializeObject(rm);
            Clients.Group(roomID).onPageUpdate(data);

        }
        public void ResetVoting(string roomID)
        {
            RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
            rm.currentStory.poll = rm.currentStory.cards.ToDictionary(x => x, x => 0);
            rm.roomUsers.ToList().ForEach(x => { x.prevVote = null; x.vote = null; } );

            string data = JsonConvert.SerializeObject(rm);
            Clients.Group(roomID).onPageUpdate(data);
            Clients.Group(roomID).onClearVotes();
        }
        public void FinalizeVote(string roomID)
        {
            RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
            string finalVal = "";
            foreach(var item in rm.currentStory.poll.OrderBy(x=> x.Value))
            {
                char firstChar = item.Key.Trim().ToCharArray()[0];
                if (Char.IsDigit(firstChar))
                {
                    finalVal = item.Key; 
                }
                
            }
            rm.Stories.First(x => x.storyName == rm.currentStory.storyName).finalValue = finalVal;
            rm.currentStory.finalValue = finalVal;

            string data = JsonConvert.SerializeObject(rm);
            Clients.Group(roomID).onPageUpdate(data);

        }
        public void UpdateCards(Boolean updateAll, List<string> cards, string roomID)
        {
            RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
            rm.currentStory.cards = cards;
            rm.currentStory.poll = cards.ToDictionary(y => y, y => 0);
            rm.Stories.First(x => x.storyName == rm.currentStory.storyName).cards = cards;
            if (updateAll)
            {
               foreach(StoryModel sm in rm.Stories)
                {
                    sm.cards = cards;
                    sm.poll = cards.ToDictionary(y => y, y => 0);
                }
            }


            string data = JsonConvert.SerializeObject(rm);
            Clients.Group(roomID).onPageUpdate(data);
        }

        public void StoryChange(string roomID, StoryModel story)
        {
            RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
            rm.currentStory = story;
            rm.currentStory.poll = rm.currentStory.cards.ToDictionary(x => x, x => 0);
            rm.roomUsers.ToList().ForEach(x => { x.prevVote = null; x.vote = null; } );

            string data = JsonConvert.SerializeObject(rm);
            Clients.Group(roomID).onPageUpdate(data);
            Clients.Group(roomID).onClearVotes();

        }

        public RoomModel JoinRoom(string roomID)
        {
            try
            {
                RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == roomID);
                UserModel um = ConnectedUsers.First(x => x.connectionID == Context.ConnectionId);

                um.sessionID = Context.Request.Cookies["ASP.NET_SessionId"].Value;
                rm.roomMessage = um.name + " has joined the room";

                if (rm.roomModerators.Contains(um.sessionID))
                {
                    um.isModerator = true;
                }
                rm.roomUsers.Add(um); //add user to the room's list
                Groups.Add(Context.ConnectionId, roomID);

                //update caller's state information
                string data = JsonConvert.SerializeObject(um);
                Clients.Caller.selfUpdate(data);

                return rm;
               
            }
            catch (Exception e)
            {
                Clients.Caller.onSendError(e.Message);
                return null;
            }
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.connectionID == Context.ConnectionId);
            if (item != null)
            {
                ConnectedUsers.Remove(item);
                foreach(RoomModel rm in CurrentRooms.liveRooms) //remove user from each room's list
                {
                    try
                    {
                        UserModel um = rm.roomUsers.First(x => x.connectionID == item.connectionID);
                        rm.roomUsers.Remove(um);
                        rm.roomMessage = um.name + " has left the board";
                        if(um.vote != null) {
                            rm.currentStory.poll[um.vote]--; //remove user's last vote
                        }
                        
                        string data = JsonConvert.SerializeObject(rm);
                        Clients.Group(rm.RoomID).onPageUpdate(data);
                    } catch(Exception e)
                    {

                    }
                }

            }

            return base.OnDisconnected(stopCalled);
        }
    }
}