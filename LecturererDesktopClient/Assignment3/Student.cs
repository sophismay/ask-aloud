using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment3 {
    public class Student {
        private string _username;
        private string _easyrtcid;

        public string Username {
            get { return _username; }
            set { _username = value; }
        }
        public string Easyrtcid {
            get { return _easyrtcid; }
            set { _easyrtcid = value; }
        }

        public Student (string username, string easyrtcid) {
            Username = username;
            Easyrtcid = easyrtcid;
        }
    }
}
