using CefSharp;
using CefSharp.OffScreen;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment3 {

    //This Class connects this C# Application with the Javascript code 
    //inside the lecturer_client.js file.
    class JavaScriptBridge {

        //delegates for invoking methods in the GUI thread
        private delegate void ShowID(string easyrtcid);
        private delegate void AddRequester(Student student);
        private delegate void DrawPoint(Color c, int lastX, int lastY, int x, int y);
        private delegate void ClearScreen();

        private Form1 parent;
        private ChromiumWebBrowser browser;
        private double lastX, lastY;

        public JavaScriptBridge(Form1 parent, ChromiumWebBrowser browser) {
            this.parent = parent;
            this.browser = browser;
            browser.FrameLoadEnd += Browser_FrameLoadEnd;
        }

        private void Browser_FrameLoadEnd(object sender, FrameLoadEndEventArgs e) {
            //Connect();
        }

        //Executes the connect()-Method to establish an EasyRTC connection
        public void Connect(string roomName) {
            browser.GetMainFrame().ExecuteJavaScriptAsync($"connect(\"{roomName}\")");
        }

        //Executes the acceptCall()-Method
        public void AcceptCall(Student student) {
            string cmd = $"acceptCall(\"{student.Easyrtcid}\")";
            browser.GetMainFrame().ExecuteJavaScriptAsync(cmd);
        }

        //Executes the hangup()-Method to terminate active audio transmission
        public void Hangup() {
            browser.GetMainFrame().ExecuteJavaScriptAsync("hangup()");
        }

        //The following methods are called from the Javascript side

        //Notifies this application about the easyrtc-ID
        public void LoginSuccess(string easyrtcid) {
            ShowID id = parent.ShowID;
            parent.Invoke(id, easyrtcid);
        }

        //Notifies this application about an incoming request to talk
        public void CallRequest(string username, string easyrtcid) {
            Student s = new Student(username, easyrtcid);
            AddRequester add = parent.AddRequester;
            parent.Invoke(add, s);
        }

        //Processes drawing
        public void Draw(string type, string color, double x, double y) {
            Color c = Color.FromName(color);
            if (type.Equals("down")) {
                lastX = x;
                lastY = y;
            }
            DrawPoint draw = parent.Draw;
            parent.Invoke(draw, c, (int)lastX, (int)lastY, (int)x, (int)y);
            lastX = x;
            lastY = y;
        }

        //Notifies this application to clear the sketching area 
        public void Clear() {
            ClearScreen c = parent.Clear;
            parent.Invoke(c);
        }
    }
}
