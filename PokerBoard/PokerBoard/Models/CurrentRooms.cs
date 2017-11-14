using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PokerBoard.Models
{
    public class CurrentRooms
    {
        public static IList<RoomModel> liveRooms = new List<RoomModel>();
    }
}