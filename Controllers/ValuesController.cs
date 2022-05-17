using MLB_API.Models;
using MLB_API.Scraper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace MLB_API.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/GetTicket")]
        public IHttpActionResult Post(MLBmodel model)
        {
            try
            {
                MLBScraper MS = new MLBScraper();
                var re = Request;
                var headers = Request.Headers;

                if (headers.Contains("Token"))
                {
                    //MS.writeLog("Token");
                    string token = headers.GetValues("Token").First();
                    if (!string.IsNullOrEmpty(token) && token == "ea66df3b796d4967945ef67f35fef4f7")
                    {
                        if ((!string.IsNullOrEmpty(model.EventURL)))
                        {
                            //MS.writeLog("Get url");
                            string outpusstatus = MS.Input(model.EventURL, model.SeatmapId, model.Type, model.Cookies);
                            return Json(new { Status = true, Message = outpusstatus });
                        }
                        else
                            return Json(new { Status = false, Message = "Incorrect event url check again.." });
                    }
                    else
                        return Json(new { Status = false, Message = "Invalid Token!" });
                }
                else
                    return Json(new { Status = false, Message = "Invalid Token!" });
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = "Invalid Token!" });
            }

            return null;
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
