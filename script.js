let port;
async function connect(){
      try {
        port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 9600
        });
        document.getElementById('cover').style.display = "none";
        document.getElementById('connect_dialog').style.display = "none";
        while (port.readable) {
            const reader = port.readable.getReader();
            try {
                while (true) {
                    const {value, done} = await reader.read();
                    if (done) {
                        console.log("Canceled\n");
                        break;
                    }
                    const inputValue = new TextDecoder().decode(value);
                    console.log(inputValue);
                }
            } catch (error) {
                console.log("Error: Read" + error + "\n");
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        console.log("Error: Open" + error + "\n");
    }
}

async function send(str) {
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(str + "\n"));
    writer.releaseLock();
}
setInterval(function(){
  let stick1 = document.getElementById('go_back');
  let stick2 = document.getElementById('left_right');
  let led_sw = document.getElementById('led_switch');
  let go_back = stick1.value;
  let left_right = stick2.value;
  let led = led_sw.checked ? "1" : "0";
  go_back = go_back < 100 ? go_back < 10 ?  "00"+go_back : "0"+go_back : go_back
  left_right = left_right < 100 ? left_right < 10 ? "00"+left_right : "0"+left_right : left_right
  
  send(go_back+left_right+led);
},20);

function led(){
  document.getElementById('led_switch').checked = document.getElementById('led_switch').checked ? false : true;
}
