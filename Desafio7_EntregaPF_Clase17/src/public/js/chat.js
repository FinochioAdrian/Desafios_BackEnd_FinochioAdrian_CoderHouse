
    

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    async function init (){
      const socket = io();

      const { value: email } = await Swal.fire({
        title: "Input email address",
        input: "email",
        inputLabel: "Your email address",
        inputPlaceholder: "Enter your email address"
      });
      if (email) {
        Swal.fire(`Entered email: ${email}`);
        socket.emit('login', email)
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim().length>0) {
          socket.emit('message', {user:email,message:input.value});
          input.value = '';
        }
      });
  
       
  
      
      socket.on('messageLogs', (data) => {
        data.forEach(value =>{
          const item = document.createElement('li');
          item.textContent = `${value.user} -- ${value.message}`;
          messages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);

        })
      });
      socket.on('message', (data) => {
        
          const item = document.createElement('li');
          item.textContent = `${data.user} -- ${data.message}`;
          messages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);

        
      });
    

      socket.on('register', data => {
 
        Swal.fire({
            title: 'Se registro un nuevo usuario',
            text: `El nombre del usuario es ${data}`,
            icon: 'success',
            toast: true
        })
      })
    }
   
 init()