import React from 'react';
import { Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: "rgba(10, 15, 28, 0.95)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(56, 189, 248, 0.1)",
      padding: "20px 20px",
      marginTop: "40px",
      color: "#94A3B8"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px"
      }}>

        {/* You can add content here later */}

      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: "1100px",
        margin: "4px auto 0",
        padding: "20px 0 0",
        borderTop: "1px solid rgba(228, 7, 7, 0.05)",
        textAlign: "center",
        fontSize: "1rem"
      }}>
        <p>© {currentYear} Sharwari </p>
        <p style={{ marginTop: "8px", opacity: 0.5 }}>
          Empowering knowledge through real-time data.
        </p>
      </div>
    </footer>
  );
}

// Separate component (outside Footer)
const SocialIcon = ({ icon: Icon }) => (
  <a
    href="#"
    style={{
      background: "rgba(56, 189, 248, 0.1)",
      padding: "10px",
      borderRadius: "10px",
      color: "#38BDF8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.3s"
    }}
  >
    <Icon size={18} />
  </a>
);