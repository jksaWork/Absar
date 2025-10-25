import { connectToDB } from "@/utils/database.js";
import Prompt from "@/models/Prompt.js";
import { json } from "stream/consumers";
import { getQSParamFromURl } from "@/utils/QS.js";
export const POST = async (req) => {
  const { userId, prompt, tag } = await req.json();
  try {
    await connectToDB();
    console.log({ userId, prompt, tag });
    const newPrompit = new Prompt({
      userId,
      prompt,
      tag,
    });
    //  Save Propit Sccess Fuly
    await newPrompit.save();
    const repsonse = {
      message: "Create Item Create Seccuffly",
      prompt: newPrompit,
    };
    return new Response(JSON.stringify(repsonse), { status: 201 });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connectToDB();
    const search = getQSParamFromURl("search", req.url);
    // const {
    //   query: { search },
    // } = req;
    console.log(search);

    const prompts = search
      ? await Prompt.find({
          $or: [{ tag: search }, { "userId.username": search }],
        }).populate("userId")
      : await Prompt.find().populate("userId");
    const repsonse = {
      status: true,
      prompts,
    };
    return new Response(JSON.stringify(repsonse), { status: 200 });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};
