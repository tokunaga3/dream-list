import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DreamForm from "@/components/DreamForm";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                夢リスト 🌟
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                こんにちは、{session.user.name}さん
              </p>
            </div>
            <SignOutButton />
          </div>
          <DreamForm />
        </div>
      </div>
    </main>
  );
}
