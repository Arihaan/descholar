"use client";
import Link from "next/link";
import RotatingTypewriter from "./components/RotatingTypewriter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat"
        style={{
          backgroundImage: 'url("/resources/webpagebg.png")',
          backgroundSize: 'contain',
          backgroundColor: '#000',
          backgroundPosition: '0 0',
        }}
      >
      </div>

      {/* Main content - note the added z-10 to place it above the background */}
      <main className="flex-grow flex flex-col items-center justify-center py-24 relative z-10">
        <div className="text-center mb-16 mt-24">
          <h1 className="text-9xl font-['TT_Barrels'] mb-8 tracking-tight leading-tight"
              style={{
                color: '#20eab0',
                textShadow: '6px 6px 0px #301366'
              }}>
            Fund your
            <br className="mb-2" />
            <RotatingTypewriter />
          </h1>
          
          <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0 mt-16">
            <Link href="/scholarships">
              <button className="btn btn-primary btn-lg rounded-xl">
                View Scholarships
              </button>
            </Link>
            <Link href="/addscholarship">
              <button className="btn btn-secondary btn-lg rounded-xl">
                Create Scholarship
              </button>
            </Link>
          </div>
        </div>

        <section className="w-full max-w-4xl mx-auto px-8 pt-8 pb-16 bg-gray-900 bg-opacity-50 rounded-3xl shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            How DeScholar Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">
                Create Scholarships
              </h3>
              <p className="text-gray-300">
                Organizations and individuals can easily create and fund
                scholarships on our decentralized platform.
              </p>
            </div>
            <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">
                Apply for Funding
              </h3>
              <p className="text-gray-300">
                Students can browse available scholarships and apply directly
                through our user-friendly interface.
              </p>
            </div>
            <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">
                Transparent Distribution
              </h3>
              <p className="text-gray-300">
                Funds are distributed securely and transparently using
                blockchain technology, ensuring fairness for all parties.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* About section - note the added z-10 */}
      <section className="mt-12 text-center mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">About Us</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-2xl w-full md:w-5/12">
            <h2 className="text-xl font-bold mb-3 text-white">Filip Masarik</h2>
            <div>
              Student at:{" "}
              <Link href="https://www.fiit.stuba.sk/en.html?page_id=749">
                <span className="link link-secondary">FIIT STU</span>
              </Link>
            </div>
            <p className="text-gray-300">Currently a .Net Developer</p>
            <p className="text-gray-300">Winner of Ethereum Bratislava</p>
          </div>
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-2xl w-full md:w-5/12">
            <h2 className="text-xl font-bold mb-3 text-white">
              BSc. Arihaan Negi
            </h2>
            <div>
              Student at:{" "}
              <Link href="">
                <span className="link link-secondary">
                  Univeristy of Hertfortshire
                </span>
              </Link>
            </div>
            <p className="text-gray-300">Ex-IBM & Deloitte</p>
          </div>
        </div>
      </section>
    </div>
  );
}
