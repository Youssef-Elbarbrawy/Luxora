using Microsoft.AspNetCore.Mvc;

public class Chat_BotController : Controller
{
    public IActionResult Index()
    {
        ViewData["ChatButton"] = true;
        return View();
    }
}
