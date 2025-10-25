"use client";
import React, { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import Form from "@/components/Form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function UpdatePromptContent() {
  // const
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState({
    tag: "",
    prompt: "",
  });
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  const [submitting, setSubmitting] = useState(false);
  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!promptId) return alert("Missing PromptId!");

    toast.promise(
      new Promise((reslove, reject) =>
        fetch(`/api/prompt/${promptId}`, {
          method: "PATCH",
          body: JSON.stringify({
            prompt: post.prompt,
            tag: post.tag,
          }),
        })
          .then((res) => {
            //    console.log();
            if (res.status == 200) {
              //     toast("The Prompt Add Successfuly");
              reslove();
              router.push("/");
            }
          })
          .catch((err) => {
            reject();
            toast.error("Some Thing Went Worng");
          })
          .finally(() => setSubmitting(false))
      ),

      {
        pending: "Update Prompt ",
        success: "Update Prompt Done 👌",
        error: "Update Prompt Faild 🤯",
      }
    );
  };
  return (
    <Form
      type="Update"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
}

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePromptContent />
    </Suspense>
  );
}

export default Page;
