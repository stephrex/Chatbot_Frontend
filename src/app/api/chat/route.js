export async function POST(req) {
    try {
      const message= await req.json();
      
      const response = await fetch("http://localhost:5000/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
  
      if (!response.ok) {
        throw new Error("Failed to communicate with backend");
      }
  
      const data = await response.json();
      return Response.json({ reply: data });
    } catch (error) {
      console.error("Error:", error);
      return Response.json({ error: "Failed to process request" }, { status: 500 });
    }
  }