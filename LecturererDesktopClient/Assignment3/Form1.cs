using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CefSharp.OffScreen;
using CefSharp;

namespace Assignment3 {
    public partial class Form1 : Form {

        ChromiumWebBrowser browser;
                 
        public Form1() {
            InitializeComponent();
        }
        JavaScriptBridge jsb;
        private void Form1_Load(object sender, EventArgs e) {

            pictureBox1.Image = new Bitmap(500, 400);
            
            //Sets up the browser enginge, which processes the WebRTC Javascript code
            string url = "http://localhost:9000/lecturer";
            CefSettings settings = new CefSettings();
            settings.CefCommandLineArgs.Add("disable-gpu", "1");
            settings.CefCommandLineArgs.Add("enable-media-stream", "enable-media-stream");
            Cef.Initialize(settings, true, true);
            browser = new ChromiumWebBrowser(url);

            //Injects an object into the Javascript code. 
            //This allows an interaction between Javascript and C#
            jsb = new JavaScriptBridge(this, browser);
            browser.RegisterJsObject("bridge", jsb);
            
        }

        //Shows the easyrtc-ID on the screen
        public void ShowID(string easyrtcid) {
            lblID.Text = easyrtcid;
            Console.WriteLine(easyrtcid);
        }

        //Adds the Name of the Students requesting a call to the list
        public void AddRequester(Student student) {
            lstRequests.Items.Add(student);
        }

        //Draws received Point-Data on the screen
        public void Draw(Color c, int lastX, int lastY, int x, int y) {
            Graphics g = Graphics.FromImage(pictureBox1.Image);
            Pen p;
            if (c.Name.Equals("White")) {
                p = new Pen(c, 14);
            } else {
                p = new Pen(c, 2);
            }
            if (lastX == x && lastY == y) {
                g.DrawRectangle(p, x, y, 1, 1);
            } else {
                g.DrawLine(p, lastX, lastY, x, y);
            }
            
            pictureBox1.Refresh();
            Console.WriteLine($"x: {x}, y: {y}");
        }

        //Clears the sketching area
        public void Clear() {
            Graphics g = Graphics.FromImage(pictureBox1.Image);
            g.Clear(Color.White);
            pictureBox1.Refresh();
        }

        //Accepts an incoming request to talk
        private void cmdAccept_Click(object sender, EventArgs e) {
            if (lstRequests.SelectedItem != null) {
                Student audibleStudent = (Student)lstRequests.SelectedItem;
                Clear();
                jsb.AcceptCall(audibleStudent);
                
                lblActive.Text = audibleStudent.Username + " is audible.";
                lstRequests.Items.Remove(audibleStudent);
                btnEndCall.Visible = true;
            }

        }

        //Terminates an open audio transmission
        private void btnEndCall_Click(object sender, EventArgs e) {
            jsb.Hangup();
            lblActive.Text = "";
            btnEndCall.Visible = false;
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e) {
            
        }

        //Connects to the server
        private void cmdConnect_Click(object sender, EventArgs e) {
            lblID.Text = "Connecting...";
            cmdConnect.Enabled = false;
            jsb.Connect(txtRoomName.Text);
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e) {

        }
    }
    
}
