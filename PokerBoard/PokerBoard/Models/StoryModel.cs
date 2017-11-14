using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PokerBoard.Models
{
    public class StoryModel
    {
        public string storyName { get; set; }
        public string finalValue { get; set; }
        public Dictionary<string, int> poll { get; set; }
        public IList<string> cards { get; set; }

        public StoryModel()
        {
        }
        public StoryModel(string storyname)
        {
            this.storyName = storyname;
        }
    }
}