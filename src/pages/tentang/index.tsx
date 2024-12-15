import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/footer'

const Tentang = () => {
  return (
    <div className="min-h-screen bg-custom-grey">
      <Navbar />
      <div className="bg-custom-navy w-full mt-[120px]">
        <div className="px-[120px] py-20">
          <h1 className="text-5xl text-white mb-6 font-russo">
            Event Management System
          </h1>
          <p className="text-2xl text-white/80">
            Solusi Modern untuk Pengelolaan Event yang Efisien dan Profesional
          </p>
        </div>
      </div>

      <div className="px-[120px] py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl text-custom-navy font-russo">
              Selamat Datang di Event Management System!
            </h2>
            <p className="text-custom-purple-1-100 leading-relaxed">
              Dengan bangga kami mempersembahkan Event Management System, sebuah platform inovatif yang dirancang untuk memudahkan pengelolaan dan pendaftaran event secara efisien.
            </p>
            <p className="text-custom-purple-1-100 leading-relaxed">
              Website ini sepenuhnya dikembangkan secara mandiri sebagai wujud dedikasi dan hasil pembelajaran mendalam dalam pengembangan web. Dari merancang antarmuka pengguna hingga membangun sistem backend yang handal, setiap detail telah dirancang untuk memberikan pengalaman terbaik bagi pengguna.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-custom-dua h-[400px] flex items-center justify-center overflow-hidden">
            <img src="https://i.pinimg.com/736x/7a/98/d2/7a98d2674483b32637dd81e8b7a55cb3.jpg" alt="" />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl text-custom-navy mb-12 text-center font-russo">
            Fitur Utama Platform
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Pengelolaan Event yang Mudah",
                desc: "Penyelenggara dapat dengan mudah membuat, mengedit, dan menghapus acara sesuai kebutuhan. Setiap event dilengkapi informasi lengkap, seperti tanggal, lokasi, kategori, serta opsi apakah acara berbayar atau gratis."
              },
              {
                title: "Pendaftaran Peserta yang Praktis",
                desc: "Pengguna dapat mendaftar ke event pilihan mereka hanya dengan beberapa langkah sederhana. Untuk acara berbayar, tersedia pilihan metode pembayaran langsung di formulir pendaftaran."
              },
              {
                title: "Navigasi yang Intuitif",
                desc: "Desain platform yang user-friendly memastikan pengguna dapat menjelajahi dan menggunakan fitur dengan mudah tanpa kebingungan."
              },
              {
                title: "Kategori dan Lokasi Terorganisir",
                desc: "Event dikelompokkan berdasarkan kategori dan lokasi untuk memudahkan pencarian. Lokasi fokus pada kota-kota besar di Pulau Jawa untuk relevansi yang lebih baik."
              },
              {
                title: "Dukungan Event Multi-Hari",
                desc: "Platform ini mendukung pengelolaan sesi untuk acara yang berlangsung lebih dari satu hari, memastikan fleksibilitas dalam pengaturan jadwal."
              },
              {
                title: "Sistem Pembayaran Terintegrasi",
                desc: "Dilengkapi dengan sistem pembayaran yang aman dan terintegrasi untuk memudahkan transaksi event berbayar."
              }
            ].map((fitur, index) => (
              <div key={index} 
                className="bg-white p-8 rounded-xl shadow-custom-dua hover:shadow-custom transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl text-custom-navy mb-4 font-russo">
                  {fitur.title}
                </h3>
                <p className="text-gray-500">
                  {fitur.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Section */}
        <div className="bg-white rounded-xl shadow-custom-dua p-12 mb-20">
          <h2 className="text-3xl text-custom-navy mb-8 font-russo">
            Mengapa Proyek Ini Dibuat?
          </h2>
          <div className="space-y-6">
            <p className="leading-relaxed text-custom-purple-1-100">
              Event Management System lahir dari semangat untuk menciptakan platform yang bermanfaat bagi banyak orang. Proyek ini bertujuan untuk membantu penyelenggara event, baik kecil seperti workshop maupun besar seperti konferensi, dalam mengelola acara mereka secara digital dengan cara yang praktis dan hemat biaya.
            </p>
            <p className="leading-relaxed text-custom-purple-1-100">
              Sebagai hasil karya seorang pengembang mandiri, platform ini juga merupakan wujud komitmen untuk terus berkembang dan memberikan solusi nyata yang membantu kebutuhan masyarakat.
            </p>
            <div className="pt-6 border-t border-custom-grey">
              <p className="text-xl text-gray-500 font-russo text-center">
                Terima kasih telah menggunakan Event Management System. Kami berharap platform ini dapat memberikan pengalaman terbaik bagi Anda dalam mengelola event!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Tentang