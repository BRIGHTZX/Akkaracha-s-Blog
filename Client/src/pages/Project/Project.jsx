import CallToAction from "@/components/CallToAction";

export default function Project() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center p-3 gap-6">
      <div className="border-b w-full text-center pb-6">
        <h1 className="text-5xl font-semibold uppercase m-6">Project</h1>
        <p className="text-lg text-gray-500">
          Build fun and engaging projects while learning HTML, CSS, and
          JavaScript!
        </p>
      </div>
      <CallToAction />
    </div>
  );
}
