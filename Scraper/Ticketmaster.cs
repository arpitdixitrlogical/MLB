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
        public static string Errorcode = "";
        public static Random random = new Random();
        List<TicketmasterModel> Outputlist = new List<TicketmasterModel> { };

        public static string[] UserAgentList = File.ReadAllLines(Input_path + "UserAgent.txt");
        public static string[] Refererlist = File.ReadAllLines(Input_path + "referer.txt");
        public static string[] GEOCountrylist = File.ReadAllLines(Input_path + "GEOCountry.txt");

        public static string isuseproxy = "local";
        public static int useragentnum = 0;
        public static int iprand = 0;
        public static string geosurf = "geosurf";
        public static string proxyrack = "proxyrack";


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
                isuseproxy = "local";

                int datacount = jsondata["Urls"].Count;

                for (int i = 0; i < datacount; i++)
                {
                    string EventURL = "";
                    if (jsondata["Urls"][i]["eventURL"] != null)
                        EventURL = jsondata["Urls"][i]["eventURL"];

                    OpenSeleniume("", EventURL);
                }
            }
            catch (Exception ex)
            {
                Errorcode = "Status Code:404.5";
                Outputlist.Add(new TicketmasterModel { Status = "false", Message = Errorcode });
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
                    string GEOexe_path = Input_path + @"edmgabkkegnklhhghcijffilbmfmmnji\6.6.1_0";

                    string Rackexe_path1 = Input_path + @"dpplabbmogkhghncfbfdeeokoefdjegm\1.10.7_0";

                    string Rackexe_path2 = Input_path + @"enhldmjbphoeibbpdhmjkchohnidgnah\0.9.1_0";

                    var options = new ChromeOptions();
                    options.AddExcludedArguments(new List<string>() { "enable-automation" });
                    options.AddArgument("--profile-directory=Default");
                    options.AddArgument(@"load-extension=" + Rackexe_path1 + "," + Rackexe_path2 + "");

                    if (isuseproxy == geosurf)
                        options.AddArgument("load-extension=" + GEOexe_path);
                    else if (isuseproxy == "proxyrack")
                        options.AddArgument(@"load-extension=" + Rackexe_path1 + "," + Rackexe_path2 + "");

                    options.AddArgument("--disable-blink-features");
                    options.AddArgument("--disable-blink-features=AutomationControlled");
                    options.AddArgument("--user-agent=" + UserAgentList[rnum] + "");
                    options.AddArguments("start-maximized");
                    cd = new ChromeDriver(Input_path, options);
                    Thread.Sleep(1000);

                    if (isuseproxy == geosurf)
                        ProxyChnage(cd);
                    else if (isuseproxy == proxyrack)
                        ChnageProxyExtention(cd);

                    Closetab(cd, false);
                    Navigation(cd, "", EventURL);
                }
                else
                    Navigation(cd, "", EventURL);
            }
            catch (Exception ex)
            {
                Errorcode = "Status Code:420";
                Outputlist.Add(new TicketmasterModel { EventURL = EventURL, Status = "false", Message = Errorcode });
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
                string Cookie = ""; string reese84 = "";
                //cd.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(10));
                cd.Navigate().GoToUrl(EventURL);
                Thread.Sleep(5000);
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
                    Outputlist.Add(new TicketmasterModel { EventURL = EventURL, Status = "true", Message = Cookie, Proxy = isuseproxy });
                    CloseBrowser(cd);
                    isuseproxy = "local";
                }
                else
                {
                    if (isuseproxy == "local")
                        isuseproxy = geosurf;
                    else if (isuseproxy == geosurf)
                        isuseproxy = proxyrack;

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
                cd.Close();
                cd.Dispose();
                cd.Quit();
                cd = null;

            }
            catch (Exception ex)
            {
                CloseTab();
                cd = null;
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
                    //Outputlist.Add(new TicketmasterModel { Status = "false", Message = Cookie }); ;
                    //Outputlist.Add(new TicketmasterModel { Status = "false", Message = ex.ToString() });
                }
            }
        }

        public static void ChnageProxyExtention(IWebDriver cd)
        {
            try
            {
                cd.Manage().Timeouts().PageLoad = TimeSpan.FromSeconds(15);

                cd.Navigate().GoToUrl("chrome-extension://dpplabbmogkhghncfbfdeeokoefdjegm/options.html"); Thread.Sleep(1000);
                if (cd.PageSource.Contains("New Profile</span>"))
                {
                    cd.FindElement(By.Id("profileName")).Clear();
                    cd.FindElement(By.Id("profileName")).SendKeys("Test");
                    cd.FindElement(By.Id("httpProxyHost")).Clear();
                    cd.FindElement(By.Id("httpProxyHost")).SendKeys("premium.residential.proxyrack.net");
                    cd.FindElement(By.Id("httpProxyPort")).Clear();
                    cd.FindElement(By.Id("httpProxyPort")).SendKeys("9000");
                    cd.FindElement(By.Id("useSameProxy")).Click();
                    cd.FindElement(By.Id("profileName")).Click();
                    cd.FindElement(By.Id("saveOptions")).Click();

                }
                else
                {
                    System.Diagnostics.Debugger.Break();
                }

                cd.Navigate().GoToUrl("chrome-extension://dpplabbmogkhghncfbfdeeokoefdjegm/popup.html");
                Thread.Sleep(1000);

                if (cd.PageSource.Contains("Test"))
                {
                    Closetab(cd, true);

                    cd.FindElement(By.Id("Test")).Click(); Thread.Sleep(100);
                    cd.SwitchTo().Window(cd.WindowHandles.Last());

                rty:
                    try
                    {
                        cd.Navigate().GoToUrl("chrome-extension://enhldmjbphoeibbpdhmjkchohnidgnah/options.html");
                        Thread.Sleep(1100);
                    }
                    catch (Exception ex)
                    { Thread.Sleep(1000); goto rty; }

                    if (cd.PageSource.Contains("<th class=\"username"))
                    {
                        if (!cd.PageSource.Contains("https://www.ticketmaster"))
                        {
                            cd.FindElement(By.Id("url")).Clear();
                            cd.FindElement(By.Id("url")).SendKeys("https://www.ticketmaster");
                            cd.FindElement(By.Id("username")).Clear();
                            cd.FindElement(By.Id("username")).SendKeys("jockey");
                            cd.FindElement(By.Id("password")).Clear();
                            cd.FindElement(By.Id("password")).SendKeys("116637-6f338e-90e3f8-a8afda-5f4130");
                            cd.FindElement(By.Id("priority")).Clear();
                            cd.FindElement(By.Id("priority")).SendKeys("1");
                            cd.FindElement(By.XPath(".//button[@class='credential-form-submit']")).Click(); Thread.Sleep(800);
                        }
                    }
                    Closetab(cd, false);
                }
            }
            catch (Exception ex)
            {
            }
        }

        public static void Closetab(IWebDriver cd, bool closetabs)
        {
            try
            {
                var tabs = cd.WindowHandles;
                
                if (closetabs == false)
                {
                    cd.SwitchTo().Window(tabs[0]);
                    if (tabs.Count > 1)
                    {

                        cd.SwitchTo().Window(tabs[0]).Close();
                        cd.SwitchTo().Window(tabs[1]);
                        Thread.Sleep(1000);
                    }
                }
                else
                {
                rty:
                    tabs = cd.WindowHandles;
                    if (tabs.Count > 1)
                    {
                    }
                    else
                    {
                        ((IJavaScriptExecutor)cd).ExecuteScript("window.open();"); goto rty;
                    }
                }
            }
            catch (Exception ex)
            {
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