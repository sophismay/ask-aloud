using CefSharp;
using CefSharp.OffScreen;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment3 {
    class JavaScriptBridge {

        private delegate void ShowID(string easyrtcid);
        private delegate void AddRequester(Student student);
        private delegate void DrawPoint(Color c, int lastX, int lastY, int x, int y);
        private delegate void ClearScreen();

        private Form1 parent;
        private ChromiumWebBrowser browser;
        private int lastX, lastY;

        public JavaScriptBridge(Form1 parent, ChromiumWebBrowser browser) {
            this.parent = parent;
            this.browser = browser;
            browser.FrameLoadEnd += Browser_FrameLoadEnd;
        }

        private void Browser_FrameLoadEnd(object sender, FrameLoadEndEventArgs e) {
            //Connect();
        }

        public void Connect(string roomName) {
            browser.GetMainFrame().ExecuteJavaScriptAsync($"connect(\"{roomName}\")");
        }

        public void AcceptCall(Student student) {
            string cmd = $"acceptCall(\"{student.Easyrtcid}\")";
            browser.GetMainFrame().ExecuteJavaScriptAsync(cmd);
        }

        public void Hangup() {
            browser.GetMainFrame().ExecuteJavaScriptAsync("hangup()");
        }

        public void LoginSuccess(string easyrtcid) {
            ShowID id = parent.ShowID;
            parent.Invoke(id, easyrtcid);
        }

        public void CallRequest(string username, string easyrtcid) {
            Student s = new Student(username, easyrtcid);
            AddRequester add = parent.AddRequester;
            parent.Invoke(add, s);
        }

        public void Draw(string type, string color, int x, int y) {
            Color c = Color.FromName(color);
            if (type.Equals("down")) {
                lastX = x;
                lastY = y;
            }
            DrawPoint draw = parent.Draw;
            parent.Invoke(draw, c, lastX, lastY, x, y);
            lastX = x;
            lastY = y;
        }

        public void Clear() {
            ClearScreen c = parent.Clear;
            parent.Invoke(c);
        }
    }
}
