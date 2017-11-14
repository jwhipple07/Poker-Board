using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PokerBoard.Models
{
    public class RoomModel
    {
        public Dictionary<string, int> poll { get; set; }
        public IList<string> cards { get; set; }
        public string RoomID { get; set; }
        [Required]
        public string RoomName { get; set; }
        [Required]
        public string ModeratorPassword { get; set; }
        public Dictionary<string, string> StoriesPoll { get; set; }
        [Required]
        public IList<StoryModel> Stories { get; set; }
        public StoryModel currentStory { get; set; }
        public IList<UserModel> roomUsers { get; set; }
        public IList<String> roomModerators { get; set; }
        public string roomMessage { get; set; }

        public int roomState { get; set; } //-1: No votes Allowed, 0: Open Voting, 1:Show Results

        public RoomModel()
        {
            DefaultCards dc = new DefaultCards();

            this.cards = dc.cards;
            this.poll = dc.cards.ToDictionary(x => x, x => 0); //using default cards
            this.Stories = new List<StoryModel>();
            this.Stories.Add(new StoryModel("Story 1"));
            this.roomUsers = new List<UserModel>();
            this.roomModerators = new List<string>();
        }
    }
}