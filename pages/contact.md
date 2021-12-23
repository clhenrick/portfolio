---
layout: page
title: "Contact"
meta_description: "Contact Chris Henrick"
subheadline: ""
teaser: "Want to get in touch with me? Please use the contact form below."
permalink: "/contact/"
header: no
---

<style>
form label {
  color: #fff;
}
textarea, 
textarea:focus {
  color: rgba(0, 0, 0, 0.75);
  background-color: #fafafa;
}

#g-recaptcha-response {
  display: block !important;
  position: absolute;
  margin: -50px 0 0 0 !important;
  z-index: -999999;
  opacity: 0;
}
</style>

<div class="panel">

<form
  action="https://formspree.io/f/xdoylarw"
  method="POST"
>
  <label>
    Your email:
    <input type="email" name="_replyto">
  </label>
  <label>
    Your message:
    <textarea name="message"></textarea>
  </label>
  <div class="g-recaptcha" data-sitekey="6LfG2b8dAAAAANoEy4J7PvQTlZZd0PzncvA7nljw"></div>
  <br/>
  <button type="submit">Send</button>
</form>
</div>

<script>
  window.onload = function() { 
  var el = document.getElementById('g-recaptcha-response'); 
  if (el) { 
    el.setAttribute('required', 'required'); 
  } 
}
</script>