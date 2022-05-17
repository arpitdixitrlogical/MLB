using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace MLB_API.Scraper
{
    public class MyWebClient : WebClient
    {
        public int Timeout { get; set; }

        protected override WebRequest GetWebRequest(Uri address)
        {
            var request = base.GetWebRequest(address);
            request.Timeout = Timeout;
            return request;
        }
    }
}