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
            //Draw(Color.Black, 1, 1, 2, 1);
            string url = "http://localhost:9000/lecturer2";
            CefSettings settings = new CefSettings();
            settings.CefCommandLineArgs.Add("disable-gpu", "1");
            settings.CefCommandLineArgs.Add("enable-media-stream", "enable-media-stream");
            Cef.Initialize(settings, true, true);
            browser = new ChromiumWebBrowser(url);

            jsb = new JavaScriptBridge(this, browser);
            browser.RegisterJsObject("bridge", jsb);
            //toolStripContainer1.ContentPanel.Controls.Add(browser);
            
        }

        public void ShowID(string easyrtcid) {
            lblID.Text = easyrtcid;
            Console.WriteLine(easyrtcid);
        }

        public void AddRequester(Student student) {
            lstRequests.Items.Add(student);
        }

        public void Draw(Color c, int lastX, int lastY, int x, int y) {
            Graphics g = Graphics.FromImage(pictureBox1.Image);
            Pen p;
            if (c.Name.Equals("White")) {
                p = new Pen(c, 14);
            } else {
                p = new Pen(c, 2);
            }
            g.DrawLine(p, lastX, lastY, x, y);
            pictureBox1.Refresh();
            Console.WriteLine($"x: {x}, y: {y}");
        }

        public void Clear() {
            Graphics g = Graphics.FromImage(pictureBox1.Image);
            g.Clear(Color.White);
            pictureBox1.Refresh();
        }
        private void cmdAccept_Click(object sender, EventArgs e) {
            if (lstRequests.SelectedItem != null) {
                Student audibleStudent = (Student)lstRequests.SelectedItem;
                jsb.AcceptCall(audibleStudent);
                lblActive.Text = audibleStudent.Username + " is audible.";
                lstRequests.Items.Remove(audibleStudent);
                btnEndCall.Visible = true;
            }

        }

        private void btnEndCall_Click(object sender, EventArgs e) {
            jsb.Hangup();
            lblActive.Text = "";
            btnEndCall.Visible = false;
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e) {
            //jsb.Close();
        }

        private void cmdConnect_Click(object sender, EventArgs e) {
            lblID.Text = "Connecting...";
            cmdConnect.Enabled = false;
            jsb.Connect(txtRoomName.Text);
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e) {

        }
    }
    
}
