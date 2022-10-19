const express = require('express');                                 //import webserver module
const GPIO = require('pigpio').Gpio;                                //import gpio module and use gpio
const app = express();                                              //create app with express webserver

const LED_R = new GPIO('17',{mode: GPIO.OUTPUT});                   //set GPIO 17 as output
const BTN_R = new GPIO('18',{mode: GPIO.INPUT,edge: rising});       //set GPIO 18 as input with interrupt on rising edge

BTN_R.glitchFilter(10000);                                          //set debounce filter for GPIO 18

var tmp = 0;                                                        //create temp variable for led current state

BTN_R.on('interrupt', (level) =>{                                   //ISR for button press
    if(tmp == 0){                                                   //ask led current state and decide
        tmp = 1;                                                    //set current state on
        LED_R.writeSync(tmp);                                       //set led on
    }else{                                                          
        tmp = 0;                                                    //set current state off
        LED_R.writeSync(tmp);                                       //set led off
    }
});

LED_R.digitalWrite(tmp);                                            //set led off at begin

app.use(express.text());                                            //set request format type of webserver to text

app.get('/',(req,res) =>{                                           //set request response for get on '/'
    res.sendFile(__dirname+'/html/index.html')                      //send back html website file
});

app.post('/r',(req,res) =>{                                         //set response method for post on '/r'
    if(tmp == 0){                                                   //ask led current state and decide
        tmp = 1;                                                    //set current state on
        LED_R.digitalWrite(tmp);                                    //set led on
    }else{
        tmp = 0;                                                    //set current state off
        LED_R.digitalWrite(tmp);                                    //set led off
    }
    res.end();                                                      //sends empty response back to signalize the post got recieved
});

app.listen(5000);                                                   //set server port to port 5000 and start listening for post or get