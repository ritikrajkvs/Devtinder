const Footer = () => {
    return (
      <footer className="footer footer-center p-10 bg-[#0f172a] text-gray-500 border-t border-white/5">
        <aside>
          <div className="flex items-center gap-2 mb-2">
             <span className="text-2xl">🔥</span>
             <span className="font-bold text-white text-xl">DevTinder</span>
          </div>
          <p className="font-medium">
            Connecting Developers Since 2024. <br />
            Built with React, Node, and ❤️.
          </p>
          <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
        </aside>
      </footer>
    );
  };
  
  export default Footer;
