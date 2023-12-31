const { default: axios } = require("axios");

const serverError = (res, err) => {
  res.status(500).json({ error: err.message });
};
const createEmailHTML = (randQuote) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
   
    
    <body>
      <div class="container", style="min-height: 40vh;
      padding: 0 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;"> 
       <div class="card" style="margin-left: 20px;margin-right: 20px;">
          <div style="font-size: 14px;">
          <div class='card' style=" background: #f0c5c5;
          border-radius: 5px;
          padding: 1.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;">
      
        <p>${randQuote.quote}</p>
        <blockquote>by ${randQuote.author}</blockquote>
      
    </div>
          <br>
          </div>
          
         
          <div class="footer-links" style="display: flex;justify-content: center;align-items: center;">
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">Unsubscribe?</a>
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">About Us</a>
         
          </div>
          </div>
      
            </div>
           
    </body>
    </html>`;
};
//Work
const getSubs = async () => {
  const subs = await axios.get(process.env.SERVER_LINK + "/getSubscribers");
  const list = [];
  subs.data.map((sub) => {
    list.push(sub.email.S);
  });
  return list;
};
//Work
const getQuote = async () => {
  const getQuotes = await axios.get(process.env.SERVER_LINK + "/quotes");
  const length = getQuotes.data.quotes.length;
  const randomQuote = getQuotes.data.quotes[Math.floor(Math.random() * length)];

  return randomQuote;
};

module.exports = {
  serverError,
  createEmailHTML,
  getQuote,
  getSubs,
};
