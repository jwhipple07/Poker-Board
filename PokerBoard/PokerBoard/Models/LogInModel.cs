using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PokerBoard.Models
{
    public class LogInModel
    {
        [Required]
        [DataType(DataType.Text)]
        public string Name { get; set; }
        

        [HiddenInput]
        public string ReturnUrl { get; set; }
    }
}