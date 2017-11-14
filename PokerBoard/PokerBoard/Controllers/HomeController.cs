using PokerBoard.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace PokerBoard.Controllers
{
    public class HomeController : Controller
    {
        private static Random random = new Random();
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult NewRoom()
        {
            RoomModel newRoom = new RoomModel();
            //generate a random room number
            newRoom.RoomID = RandomString(5);
            return View(newRoom);
        }
        [HttpPost]
        public ActionResult NewRoom(RoomModel postData)
        {
            if (ModelState.IsValid) {
                //process the data to verify that it is valid
                postData.Stories.ToList().ForEach(x => x.cards = postData.cards);
                postData.Stories.ToList().ForEach(x => x.poll = postData.cards.ToDictionary(y => y, y => 0));
                postData.currentStory = postData.Stories.ElementAt(0); //set initial story to the first one.

                //store Session id as a moderator
                string sessionID = HttpContext.Session.SessionID;
                postData.roomModerators.Add(sessionID);

                //encrypt password for JSON requests
                postData.ModeratorPassword = EncryptDecrypt.encrypt(postData.ModeratorPassword);
            
                CurrentRooms.liveRooms.Add(postData);
                return RedirectToAction("Room", "Poker", new { id = postData.RoomID });
            }
            return View(postData);
        }

        private static string RandomString(int length)
        {
            const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";
            var chars = Enumerable.Range(0, length)
                .Select(x => pool[random.Next(0, pool.Length)]);
            return new string(chars.ToArray());
        }

        public ActionResult PokerVote()
        {
            return View();
        }
    }
}