export async function GET(request) {
  console.log("=== GET REQUEST TO LOGIN API ===");
  return Response.json({ message: "Login API is working", method: "GET" });
}

export async function POST(request) {
  console.log("=== API ROUTE CALLED ===");
  console.log("Request method:", request.method);
  console.log("Request URL:", request.url);
  
  try {
    const body = await request.json();
    console.log("Request body received:", body);
    
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return Response.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Basic authentication check
    if (trimmedUsername === "1fatam" && trimmedPassword === "fatam123") {
      // Log successful login
      console.log(`Employee login successful: ${trimmedUsername} at ${new Date().toISOString()}`);
      
      return Response.json(
        { 
          success: true, 
          message: "تم تسجيل الدخول بنجاح",
          user: { 
            username: trimmedUsername, 
            role: "employee",
            loginTime: new Date().toISOString()
          }
        },
        { status: 200 }
      );
    } else {
      // Log failed login attempt
      console.log(`Failed login attempt: ${trimmedUsername} at ${new Date().toISOString()}`);
      
      return Response.json(
        { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
