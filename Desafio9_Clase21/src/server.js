

export default function Server (app,port=8080){
    
     const httpServer = app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
      });
      return httpServer
}


