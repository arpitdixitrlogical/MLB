using HtmlAgilityPack;
using MLB_API.Models;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;

namespace MLB_API.Scraper
{
    public class Ticketmaster
    {
        public static IWebDriver cd = null;
        public static string directory_name = AppDomain.CurrentDomain.BaseDirectory;
        public static string Input_path = directory_name + "DATA\\INPUT\\";
        public static string Output_path = directory_name + "DATA\\OUTPUT\\" + System.DateTime.Now.ToString("MM-dd-yyyy");
        public static string Error_list = directory_name + "DATA\\OUTPUT\\" + System.DateTime.Now.ToString("MM-dd-yyyy") + "\\Error.txt";
        public static string Cookiestext = directory_name + "DATA\\OUTPUT\\" + System.DateTime.Now.ToString("MM-dd-yyyy") + "\\Cookies.txt";

        public static Random random = new Random();
        List<TicketmasterModel> Outputlist = new List<TicketmasterModel> { };

        public static string[] UserAgentList = File.ReadAllLines(Input_path + "UserAgent.txt");
        public static string[] Refererlist = File.ReadAllLines(Input_path + "referer.txt");
        public static string[] GEOCountrylist = File.ReadAllLines(Input_path + "GEOCountry.txt");
        public static bool Isuseproxy = false;
        public static int useragentnum = 0;
        public static int iprand = 0;


        public List<TicketmasterModel> Input(dynamic jsondata)
        {
            try
            {
                List<TicketmasterModel> Outputlist = new List<TicketmasterModel> { };

                //IWebDriver cd = null;
                CreateDirectory(Output_path);
                CreateDirectory(Input_path);
                CreateNotepad(Cookiestext);
                CreateNotepad(Error_list);
                Isuseproxy = false;

                int datacount = jsondata["Urls"].Count;

                for (int i = 0; i < datacount; i++)
                {
                    string EventURL = "";
                    if (jsondata["Urls"][i]["eventURL"] != null)
                        EventURL = jsondata["Urls"][i]["eventURL"];

                    //open Seleniume..
                    OpenSeleniume("", EventURL);

                    //if (cd == null)
                    //{

                    //    //PageSource = Navigation(cd, "id=\"venuemap-container\"", EventURL, GetType, SeatmapId);

                    //}
                    //else
                    //{
                    //    Outputlist.Add(new TicketmasterModel { EventURL = EventURL, Status = "true", Message = "Seleniume Not working check it" });
                    //    return Outputlist;
                    //}

                }

                //Environment.Exit(0);
            }
            catch (Exception ex)
            {
                Outputlist.Add(new TicketmasterModel { Status = "false", Message = ex.ToString() });
                return Outputlist;
            }
            return Outputlist;
        }

        public void CreateDirectory(string path)
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

        public void CreateNotepad(string path)
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

        public void writeLog(string message)
        {
            try
            {
                //StreamWriter log_writer = new StreamWriter(Error_list, true);
                //log_writer.WriteLine(message);
                //log_writer.AutoFlush = true;
                //log_writer.Close();
                //log_writer.Dispose();
            }
            catch (Exception ex)
            {
                writeLog(ex.Message);
                writeLog("Error While Saving Data : " + ex.Message);
            }
        }

        public void OpenSeleniume(object obj, string EventURL)
        {

            int rnum = random.Next(0, UserAgentList.Count()-1);
            string page = "";
            try
            {
                try
                {
                    page = cd.PageSource;
                }
                catch (Exception ex)
                {
                    page = null;
                }


                if (page == null)
                {
                    string exe_path = Input_path + @"edmgabkkegnklhhghcijffilbmfmmnji\6.6.1_0";

                    //var driverService = ChromeDriverService.CreateDefaultService();
                    //driverService.HideCommandPromptWindow = true;

                    var options = new ChromeOptions();
                    options.AddExcludedArguments(new List<string>() { "enable-automation" });
                    //options.AddAdditionalCapability("useAutomationExtension", false);
                    options.AddArgument("--profile-directory=Default");
                    //options.AddArgument("--incognito");
                    if (Isuseproxy == true)
                        options.AddArgument("load-extension=" + exe_path);

                    options.AddArgument("--disable-blink-features");
                    options.AddArgument("--disable-blink-features=AutomationControlled");
                    //options.Proxy = new Proxy { HttpProxy = "173.208.152.162:19004", SslProxy = "173.208.152.162:19004", Kind = ProxyKind.Manual };
                    options.AddArgument("--user-agent=" + UserAgentList[rnum] + "");
                    options.AddArguments("start-maximized");
                    cd = new ChromeDriver(Input_path, options);
                    Thread.Sleep(2000);

                    if (Isuseproxy == true)
                        ProxyChnage(cd);

                    Navigation(cd, "", EventURL);
                }
                else
                    Navigation(cd, "", EventURL);
            }
            catch (Exception ex)
            {
                Outputlist.Add(new TicketmasterModel { EventURL = EventURL, Status = "false", Message = "Chrome driver is not open" });
            }
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

        public void Navigation(IWebDriver cd, string contain, string EventURL)
        {
            try
            {
                string Cookie = ""; string reese84 = ""; string eps_sid = "";
                //cd.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(10));
                cd.Navigate().GoToUrl(EventURL);
                Thread.Sleep(2000);
                string page = cd.PageSource;


                var listofcookie = cd.Manage().Cookies.AllCookies;
                foreach (var item in listofcookie)
                {
                    if (item.Name.StartsWith("reese84"))
                    {
                        reese84 += item.Value + ";";
                    }
                }
                Cookie = reese84;

                if (Cookie != "")
                {
                    Outputlist.Add(new TicketmasterModel { EventURL = EventURL, Status = "true", Message = Cookie });
                    CloseBrowser(cd);
                    Isuseproxy = false;
                }
                else
                {
                    Isuseproxy = true;
                    CloseBrowser(cd);
                    OpenSeleniume("", EventURL);
                }

            }
            catch (Exception ex)
            {
                CloseBrowser(cd);
                OpenSeleniume("", EventURL);
            }
        }

        public void CloseBrowser(IWebDriver cd)
        {
            try
            {
                //IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                //js.ExecuteScript("window.open('" + test_url_2 + "', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,width=800,height=800')");


                cd.Close();
                cd.Dispose();
                cd.Quit();
                cd = null;

            }
            catch (Exception ex)
            {
                CloseTab();
                //Process.Start(Input_path+ "chromekill.bat");
                cd = null;
            }
        }

        public static void WriteText(string Input_Path, string message)
        {
            try
            {
                File.AppendAllText(Input_Path, message + Environment.NewLine);
            }
            catch (Exception ex)
            {

            }
        }

        public void CloseTab()
        {
            try
            {
                cd.SwitchTo().Window(cd.WindowHandles[0]).Close();
            }
            catch (Exception ex)
            {
                try
                {
                    cd.Quit();
                }
                catch (Exception ex1)
                {
                    Outputlist.Add(new TicketmasterModel { Status = "false", Message = ex.ToString() });
                }
            }
        }

        //public  void Insertdata( string token)
        //{
        //    try
        //    {
        //        //string DATABsASE_PASSWORD = "y3uy42Go6BWWpDfl";
        //        //string DB_NAME = "ticket_jockey";
        //        string connectionString = "mongodb+srv://Mohit:y3uy42Go6BWWpDfl@cluster0.jc94j.mongodb.net/ticket_jockey?retryWrites=true&w=majority";

        //        IMongoClient mongoclient = new MongoClient(connectionString);
        //        var database = mongoclient.GetDatabase("ticket_jockey");
        //        var collection = database.GetCollection<BsonDocument>("tmApiToken");

        //        //var collection = database.GetCollection<tmApiToken>("tmApiToken");
        //        //var datalist = collection.Find<tmApiToken>(a => true).ToList();

        //        //{ "Category" : /.*BOND.*/ }
        //        var tokendata = new BsonDocument
        //        {
        //        {"apiKey", token}
        //        };

        //        collection.InsertOne(tokendata);

        //    }
        //    catch (Exception ex)
        //    {
        //        Outputlist.Add(new TicketmasterModel { Status = "false", Message = ex.ToString() });

        //    }
        //}
    }

}