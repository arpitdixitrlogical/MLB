using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MLB_API.Models
{
    public class MLBmodel
    {
        public string EventURL { get; set; }
        public string Type { get; set; }
        public string SeatmapId { get; set; }
        public string Status { get; set; }
        public string Message { get; set;}
        public bool Cookies { get; set; }

    }
}