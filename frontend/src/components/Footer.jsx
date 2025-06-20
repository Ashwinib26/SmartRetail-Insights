import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} SmartRetail Insights. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#3b3b3b',
    color: '#ffffff',
    textAlign: 'center',
    padding: '1rem 0',
    marginTop: '3rem',
    fontSize: '0.9rem',
    boxShadow: '0 -2px 6px rgba(0,0,0,0.1)'
  }
};

export default Footer;
