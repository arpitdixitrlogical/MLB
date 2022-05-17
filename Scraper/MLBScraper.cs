using HtmlAgilityPack;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using WinHttp;

namespace MLB_API.Scraper
{
    public class MLBScraper
    {
        public static IWebDriver cd = null;
        public static string directory_name = AppDomain.CurrentDomain.BaseDirectory;
        public static string Input_path = directory_name + "DATA\\INPUT\\";
        public static string Output_path = directory_name + "DATA\\OUTPUT\\" + System.DateTime.Now.ToString("MM-dd-yyyy") ;
        public static string Error_list = directory_name + "DATA\\OUTPUT\\" + System.DateTime.Now.ToString("MM-dd-yyyy") + "\\Error.txt";
        public static string Cookiestext = directory_name + "DATA\\OUTPUT\\" + System.DateTime.Now.ToString("MM-dd-yyyy") + "\\Cookies.txt";
        public static string[] Museragentlist = File.ReadAllLines(Input_path + "Museragent.txt");
        public static string[] proxylist = File.ReadAllLines(Input_path + "proxlist.txt");

        public static Random random = new Random();
        public static string[] useragentlist = File.ReadAllLines(Input_path + "UserAgent.txt");
        public static string[] Countrylist = File.ReadAllLines(Input_path + "Country.txt");
        public static string[] Refererlist = File.ReadAllLines(Input_path + "referer.txt");
        public static string[] Eventlist = File.ReadAllLines(Input_path + "EventList.txt");
        public static string[] eightserlist = File.ReadAllLines(Input_path + "8090user.txt");
        public static string[] GEOCountrylist = File.ReadAllLines(Input_path + "GEOCountry.txt");

        public static int useragentnum = 0;
        public static int iprand = 0;
        public static int errorpage = 0;

        static void Main(string[] args)
        {
            try
            {
                Console.WriteLine("========================================================================================================================");
                Console.WriteLine("======================================================== MLB Scraper ==================================================");
                Console.WriteLine("========================================================================================================================");

            }
            catch (Exception ex)
            {  }
        }

        public string Input(string EventURL, string SeatmapId, string GetType, bool CookiesRequired)
        {
            //Get_HttpWebRequests();

            CreateDirectory(Output_path);
            CreateDirectory(Input_path);
            CreateNotepad(Cookiestext);
            CreateNotepad(Error_list);
            Taskkill("chromedriver");
            Taskkill("chrome");
            File.WriteAllText(Error_list, EventURL);

        rty1:
            string PageSource = "";
            try
            {
                //IWebDriver cd = null;
               

                string Cookiestextread = File.ReadAllText(Cookiestext);
                if ((Cookiestextread != "") && (CookiesRequired == false))
                {
                    PageSource = Getdata(File.ReadAllText(Cookiestext), EventURL, GetType, SeatmapId, CookiesRequired, 2);

                    if ((PageSource.Contains("Cookies is not Working")) || (PageSource.Contains("We found the wrong page. Please try again")))
                    {

                        try
                        {
                            if (cd == null)
                                Seleniume();
                            else
                                PageSource = cd.PageSource;
                        }
                        catch (Exception ex)
                        {
                            Seleniume();
                        }


                        if (cd != null)
                        {
                            PageSource = Navigation(cd, "id=\"venuemap-container\"", EventURL, GetType, SeatmapId, CookiesRequired);
                            CloseBrowser(cd);
                        }
                        else
                        {
                            return "Seleniume Not working check it ?";
                        }
                    }
                }
                else
                {
               
                    // open Seleniume data..
                    try
                    {

                        if (cd == null)
                        {
                            PageSource = Seleniume();

                        }
                        else
                            PageSource = cd.PageSource;

                    }
                    catch (Exception ex)
                    {
                        PageSource = Seleniume();
                    }



                    if (PageSource != "")
                    {
                        PageSource = Navigation(cd, "id=\"venuemap-container\"", EventURL, GetType, SeatmapId, CookiesRequired);
                        if ((PageSource == "Rescrape") || (PageSource.Contains("We found the wrong page. Please try again")))
                        {
                            goto rty1;
                        }
                        else
                            CloseBrowser(cd);
                    }
                    else if ((PageSource == "Rescrape") || (PageSource.Contains("We found the wrong page. Please try again")))
                    {
                        CloseBrowser(cd);
                        goto rty1;
                        CloseBrowser(cd);
                    }
                    else
                        return "Seleniume Not working check it ?";
                }

                //if ((PageSource.Contains("OpenQA.Selenium.WebDriverException")))
                    //goto rty1;

                //if (((PageSource.Contains("found the wrong page")) || (PageSource.Contains("Rescrape")) || (PageSource.Contains("OpenQA.Selenium.WebDriverException"))) && (!PageSource.Contains("<?xml")) && (!PageSource.Contains("<html")))
                //     goto rty1;
            }
            catch (Exception ex)
            {
                //goto rty1;
                return ex.ToString();
            }
            return PageSource;
        }

        public static string Seleniume()
        {
            useragentnum = random.Next(0, eightserlist.Count() - 1); //for ints
            int nextmixuseragent = random.Next(0, Museragentlist.Count() - 1);
            iprand = random.Next(0, 10000);

            try
            {
                string exe_path = Input_path + @"edmgabkkegnklhhghcijffilbmfmmnji\6.6.1_0";

                var options = new ChromeOptions();
                //options.AddArgument("--disable-extensions");
                options.AddArgument("--profile-directory=Default");
                // options.AddArgument("--incognito");
                options.AddArgument("load-extension=" + exe_path);
                options.AddArgument("--disable-plugins-discovery");
                options.AddArgument("--start-maximized");
                options.AddExcludedArguments(new List<string>() { "enable-automation" });
                options.AddArgument("--disable-blink-features");
                options.AddArgument("--disable-blink-features=AutomationControlled");
                //options.AddAdditionalCapability("useAutomationExtension", false);
                options.AddArgument("user-agent=" + eightserlist[useragentnum]);
                cd = new ChromeDriver(Input_path, options);
                //cd.Manage().Timeouts().PageLoad.Add(System.TimeSpan.FromSeconds(40));


                ProxyChnage(cd);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
            return cd.PageSource; ;
        }

        public static void ProxyChnage(IWebDriver cd)
        {
            try
            {


            rty:
                int nextcountry = random.Next(0, GEOCountrylist.Count() - 1);
                int a = 1;
                cd.Navigate().GoToUrl("chrome-extension://edmgabkkegnklhhghcijffilbmfmmnji/popup/popup.html");
                Thread.Sleep(2000);
                if (cd.PageSource.Contains("name=\"email\""))
                {
                    cd.FindElement(By.Name("email")).SendKeys("jojosutton1@gmail.com");
                    cd.FindElement(By.Name("password")).SendKeys("0d61b841d");
                    cd.FindElement(By.Id("button-login")).Click();
                    Thread.Sleep(2000);

                    cd.FindElement(By.XPath(".//div[@class='select-country-button']")).Click(); Thread.Sleep(500);

                    HtmlAgilityPack.HtmlDocument documentload = new HtmlAgilityPack.HtmlDocument();
                    documentload.LoadHtml(cd.PageSource);

                    HtmlNode[] aNodes = documentload.DocumentNode.SelectNodes("//div[@class=\"country-search-list\"]/div").ToArray();

                    foreach (var item in aNodes)
                    {
                        if (item.InnerHtml.Contains(GEOCountrylist[nextcountry] + "<"))
                        {
                            cd.FindElement(By.XPath("//*[@id=\"main-page\"]/div[1]/div[3]/div[2]/div[" + a + "]")).Click(); Thread.Sleep(500);
                            break;
                        }
                        else
                            a++;
                    }

                    //cd.FindElement(By.XPath(".//div[@class='button-footer button-turnon']")).Click();
                    Thread.Sleep(2000);
                    if (!cd.PageSource.Contains("<span>Turn on</span"))
                        goto rty;
                }
            }
            catch (Exception ex)
            {
                Thread.Sleep(5000);
            }
        }


        public string Navigation(IWebDriver cd, string contain,string EventURL, string GetType,string SeatmapId,bool CookiesRequired)
        {
            Rty:
            string pagesource = "";
            try
            {
                cd.Navigate().GoToUrl(EventURL);
                Thread.Sleep(2000);
                if (cd.PageSource.Contains(contain))
                {
                    pagesource= FindCookies(cd, EventURL, GetType, SeatmapId, CookiesRequired);
                }
                else if (cd.PageSource.Contains("Set Your Search Options"))
                {
                    pagesource = FindCookies(cd, EventURL, GetType, SeatmapId, CookiesRequired);
                }
                else if (cd.PageSource.Contains("id=\"event-list-filter\""))
                {
                    pagesource = FindCookies(cd, EventURL, GetType, SeatmapId, CookiesRequired);
                }
                else if (cd.PageSource.Contains("An unexpected error has occurred."))
                {
                    CloseBrowser(cd);
                    pagesource = "Rescrape";
                }
                else if (cd.PageSource.Contains("ng-binding\">This event is not on sale</span>"))
                {
                    return pagesource;
                }
                else if (cd.PageSource.Contains("<h1>Access Denied</h1>"))
                {
                    CloseBrowser(cd);
                    //Seleniume();
                    //goto Rty;
                    pagesource = "Rescrape";
                }
                else
                    return "Found Wrong page..";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
            return pagesource;
        }

        public string FindCookies(IWebDriver cd, string EventURL, string GetType, string SeatmapId,bool CookiesRequired)
        {
            string pagesource = "";
            try
            {
                pagesource = cd.PageSource;

                var asd = cd.Manage().Cookies.AllCookies;

                string Cookie = "";

                foreach (var item in asd)
                {
                    Cookie += item.Name + "=" + item.Value + "; ";
                }

                pagesource = "";
                pagesource = Getdata(Cookie, EventURL, GetType, SeatmapId, CookiesRequired,5);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
            return pagesource;
        }

        public  string Getdata(string Cookie, string EventURL, string GetType, string SeatmapId, bool checkcookies,int rtypage)
        {

            int checkreq = 0;
            string url = ""; string pagesource = "";
            string orgid = Regex.Match(EventURL, "orgid=(.*?)&").Groups[1].Value;
            string pid = (Regex.Match(EventURL, "pid=(.*?)\\d+").Groups[0].Value).Replace("pid=", "");
            string agency = Regex.Match(EventURL, "agency=(.*?)&").Groups[1].Value;

            if (!string.IsNullOrEmpty(SeatmapId.Replace("null","")))
                url = "https://mpv.tickets.com/api/pvodc/v1/events/seatmap/" + SeatmapId + "/availability/?pid=" + pid + "&agency=" + agency + "&orgId=" + orgid + "&supportsVoucherRedemption=true";
            else
                url = "https://mpv.tickets.com/api/pvodc/v1/events/" + GetType + "/availability/?pid=" + pid + "&agency=" + agency + "&orgId=" + orgid + "&supportsVoucherRedemption=true";

            rty:
            try
            {

                int nextuseragent = random.Next(0, useragentlist.Count() - 1);
                int nextmixuseragent = random.Next(0, Museragentlist.Count() - 1);
                int Proxy = random.Next(0, 145819);
                int time = random.Next(1000, 2000);
                int sensor_data = random.Next(100, 999);
                int refrerlist = random.Next(0, Refererlist.Count() - 1);
                int proxyist = random.Next(0, proxylist.Count() - 1);

                if (checkcookies == true)
                {
                    File.WriteAllText(Cookiestext, Cookie);
                    return Cookie;
                }


                if (checkreq == 0 || checkreq == 2 || checkreq == 4)
                    pagesource = Webclient(Cookie, EventURL, GetType, SeatmapId, checkcookies, nextuseragent, url, checkreq);
                else if (checkreq == 1 || checkreq == 3 || checkreq == 5)
                    pagesource = Winhttpreq(Cookie, EventURL, GetType, SeatmapId, checkcookies, nextuseragent, url, checkreq);

                Thread.Sleep(time);
                if (pagesource.StartsWith("<?xml"))
                {
                    File.WriteAllText(Cookiestext, Cookie);
                }
                else
                {
                    if (checkreq < rtypage)
                    {
                        checkreq++;
                        goto rty;
                    }
                    else
                    {
                        File.WriteAllText(Cookiestext, "");
                        return "We found the wrong page. Please try again";
                    }
                }
            }
            catch (Exception ex)
            {
                if (checkreq < rtypage)
                {
                    checkreq++;
                    goto rty;
                }

                if (checkcookies == true)
                    pagesource = "Cookies is not Working";
                else
                    return "We found the wrong page. Please try again.";

                goto rty;

            }
            return pagesource;
        }

        public static string Winhttpreq(string Cookie, string EventURL, string GetType, string SeatmapId, bool checkcookies, int nextuseragent, string url, int count)
        {
            string pagesource = "";
            int USAsate = random.Next(0, Countrylist.Count() - 1);

            try
            {
                int Proxy = random.Next(20249, 677865);

                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11;
                WinHttpRequest WinHttp_Request = new WinHttpRequest();
                WinHttp_Request.Open("GET", url);
                WinHttp_Request.SetTimeouts(4000, 4000, 4000, 4000);
                WinHttp_Request.SetRequestHeader("authority", "mpv.tickets.com");
                WinHttp_Request.SetRequestHeader("accept", "application/json");
                WinHttp_Request.SetRequestHeader("accept-language", "en-US");
                WinHttp_Request.SetRequestHeader("cookie", Cookie);

                //WinHttp_Request.SetProxy(2, ""+ Satelist[USAsate] + "-1m.geosurf.io:8000");
                //WinHttp_Request.SetCredentials("20249+"+ (Satelist[USAsate]).ToUpper() + "+20249-" + Proxy + "", "0d61b841d", 1);


                if (count == 1)
                {
                    WinHttp_Request.SetProxy(2, "" + Countrylist[USAsate] + "-1m.geosurf.io:8000");
                    WinHttp_Request.SetCredentials("20249+" + (Countrylist[USAsate]).ToUpper() + "+20249-" + Proxy + "", "0d61b841d", 1);
                }
                else if (count == 3)
                {
                    WinHttp_Request.SetProxy(2, "ca-1m.geosurf.io:8000");
                    WinHttp_Request.SetCredentials("20249+CA+20249-" + Proxy + "", "0d61b841d", 1);
                }


                WinHttp_Request.SetRequestHeader("x-referer", EventURL);
                WinHttp_Request.SetRequestHeader("x-requested-with", "com.android.browser");
                WinHttp_Request.SetRequestHeader("user-agent", Museragentlist[nextuseragent]);
                //WinHttp_Request.SetRequestHeader("user-agent", "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 7 Build/LMY48I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.84 Safari/537.36");
                WinHttp_Request.SetRequestHeader("referer", EventURL);
                WinHttp_Request.Send();
                pagesource = WinHttp_Request.ResponseText;
            }
            catch (Exception ex)
            {

            }

            return pagesource;
        }

        public static string Webclient(string Cookie, string EventURL, string GetType, string SeatmapId, bool checkcookies, int nextuseragent, string url, int count)
        {
            string pagesource = "";
            int Proxy = random.Next(0, 145819);

            try
            {
                ICredentials cred;
                using (WebClient webClient = new WebClient())
                {
                    MyWebClient wc = new MyWebClient();
                    wc.Timeout = 4000;

                    ServicePointManager.Expect100Continue = true;
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11;
                    wc.Headers.Add("Accept", "application/json");
                    wc.Headers.Add("Accept-Language", "en-US");
                    wc.Headers.Add("authority", "mpv.tickets.com");
                    wc.Headers.Add("Referer", "EventURL");
                    wc.Headers.Add("cookie", Cookie);
                    wc.Headers.Add("x-referer", "NULL");
                    wc.Headers.Add("x-requested-with", "com.android.browser");
                    wc.Headers.Add("content-type", "application/json");
                    wc.Headers.Add("user-agent", Museragentlist[nextuseragent]);
                    wc.Headers.Add("Referer", EventURL);

                    if (count == 0)
                    {
                        cred = new NetworkCredential("20249+us+20249-" + Proxy + "", "0d61b841d");
                        wc.Proxy = new WebProxy("us-1m.geosurf.io:8000", true, null, cred);
                    }
                    else if (count == 2)
                    {
                        cred = new NetworkCredential("20249+CA+20249-" + Proxy + "", "0d61b841d");
                        wc.Proxy = new WebProxy("ca-1m.geosurf.io:8000", true, null, cred);
                    }

                    pagesource = wc.DownloadString(url);

                }
            }
            catch (Exception ex)
            {
            }

            return pagesource;
        }

        public void writeLog(string message)
        {
            try
            {
                StreamWriter log_writer = new StreamWriter(Error_list, true);
                log_writer.WriteLine(message);
                log_writer.AutoFlush = true;
                log_writer.Close();
                log_writer.Dispose();
            }
            catch (Exception ex)
            {
                writeLog(ex.Message);
                writeLog("Error While Saving Data : " + ex.Message);
            }
        }

        public  void Cookiesfile(string message)
        {
            try
            {
                StreamWriter log_writer = new StreamWriter(Cookiestext, true);
                log_writer.WriteLine(message);
                log_writer.AutoFlush = true;
                log_writer.Close();
                log_writer.Dispose();
            }
            catch (Exception ex)
            {
                writeLog(ex.Message);
                writeLog("Error While Saving Data : " + ex.Message);
            }
        }

        public  void CreateDirectory(string path)
        {
            try
            {
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
            }
            catch (Exception ex)
            {
                writeLog(ex.Message);
                Console.WriteLine(ex.ToString());
            }
        }

        public  void CreateNotepad(string path)
        {
            try
            {
                if (File.Exists(path))
                {
                }
                else
                {
                    // Create the file.
                    using (FileStream fs = File.Create(path))
                    {
                    }
                }
            }
            catch (Exception ex)
            {
                writeLog(ex.Message);
                Console.WriteLine(ex.ToString());
            }
        }

        public static void CloseBrowser(IWebDriver cd)
        {
            try
            {
                cd.Close();
                cd.Dispose();
                cd.Quit();
                cd = null;
            }
            catch (Exception ex)
            {
            }
        }

        public void WriteText(string Input_Path, string message)
        {
            try
            {
                File.AppendAllText(Input_Path, message + Environment.NewLine);
            }
            catch (Exception ex)
            {
            }
        }


        public void Taskkill(string exeName)
        {
            try
            {
                string Taskkill = Input_path + "Taskkill.bat";

                if (File.Exists(Taskkill))
                    File.Delete(Taskkill);

                CreateNotepad(Taskkill);
                string WriteKilltext = "taskkill /im " + exeName + ".exe /f";
                WriteText(Taskkill, WriteKilltext);
                Process.Start(Taskkill);
                Thread.Sleep(2000);

                if (File.Exists(Taskkill))
                    File.Delete(Taskkill);
            }
            catch (Exception ex)
            {
            }
        }
        public static void Get_HttpWebRequests()
        {
           

            string ResponseText = string.Empty;
            HttpWebRequest _HttpRequest = (HttpWebRequest)WebRequest.Create("https://mpv.tickets.com/schedule/?agency=MLB_MPV&orgid=28");
            try
            {
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                _HttpRequest.Method = "GET";
                _HttpRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3";
                _HttpRequest.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36";
                _HttpRequest.ContentType = "text/html; charset=utf-8";
                _HttpRequest.Host = "mpv.tickets.com";

                using (HttpWebResponse _Response = (HttpWebResponse)_HttpRequest.GetResponse())
                {
                    using (StreamReader _ReadStream = new StreamReader(_Response.GetResponseStream()))
                    {
                        ResponseText = _ReadStream.ReadToEnd();
                    }
                }

                var returnURL = "";
                using (HttpWebResponse httpWebResponse = (HttpWebResponse)_HttpRequest.GetResponse())
                {
                    returnURL = httpWebResponse.Headers["Location"].ToString();
                }
            }
            catch (Exception Ex)
            {
                ResponseText = Ex.Message.ToString();
            }
        }


    }
}