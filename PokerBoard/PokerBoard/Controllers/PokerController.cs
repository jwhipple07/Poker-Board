using PokerBoard.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PokerBoard.Controllers
{
    public class PokerController : Controller
    {
        // GET: Poker
       public ActionResult Index()
        {

            return RedirectToAction("NoRoom");
        }

        public ActionResult Room(String id)
        {
            try
            {
                RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == id);

                //set session id cookie for signalr to use
                string sessionID = HttpContext.Session.SessionID;

                return View(rm);
            }
            catch (Exception e)
            {
                return RedirectToAction("NoRoom");
            }
        }
        public ActionResult NoRoom()
        {
            return View();
        }

        public JsonResult RoomInfo(string id)
        {
            RoomModel rm = CurrentRooms.liveRooms.First(x => x.RoomID == id);
            return Json(rm, JsonRequestBehavior.AllowGet);
        }
    }
}