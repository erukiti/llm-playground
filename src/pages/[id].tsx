import { useRouter } from "next/router";
import { Playground } from "~/components/playground/page";
import { api } from "~/utils/api";

export default function SavedPlayground() {
  const router = useRouter();
  const { id } = router.query;
  const enabled = !!id && typeof id === "string";

  const { data: playground } = api.playground.load.useQuery(
    { id: id as string },
    { enabled }
  );

  if (enabled && playground) {
    console.log(playground);
    const initialMessages = playground?.messages
      ? JSON.parse(playground.messages)
      : undefined;
    return (
      <Playground
        initialFunctions={playground?.functions}
        initialMessages={initialMessages}
        initialModel={playground?.model}
      />
    );
  }
  return <div>...loading</div>;
}
