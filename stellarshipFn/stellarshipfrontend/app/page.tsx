import Image from "next/image";

export default function Home() {
  return (
    <div className="relative">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-12">Welcome to Stellarship</h1>
          <p className="mt-4 text-lg mb-4">
            The decentralized DAO powered by Stellar
          </p>
          <a href="scholarships">
            <button className="btn btn-outline btn-secondary m-2">
              View scholarships
            </button>
          </a>
          <button className="btn btn-outline btn-accent m-2">
            Create scholarship
          </button>
        </div>
      </div>
    </div>
  );
}
