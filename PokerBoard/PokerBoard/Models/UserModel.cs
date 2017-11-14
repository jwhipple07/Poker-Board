using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PokerBoard.Models
{
    public class UserModel
    {
        public string name { get; set; }
        public string connectionID { get; set; }
        public string sessionID { get; set; }
        public string vote { get; set; }
        public string prevVote { get; set; }
        public Boolean isModerator { get; set; }
    }
}