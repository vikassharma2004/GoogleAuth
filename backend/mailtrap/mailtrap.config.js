
import { MailtrapClient } from "mailtrap";




const TOKEN = "2886838b481f7e7e8bac564d65c3359e";




export const mailtrapClient = new MailtrapClient({
  token: TOKEN,

});

export const sender = {
    email: "hello@demomailtrap.com",
    name: "vikas",
  };
 
 