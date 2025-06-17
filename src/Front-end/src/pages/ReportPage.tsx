import React, { useState, useEffect } from "react";
import { Book, Users, Calendar, BarChart2, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import reportService from "../service/reportService";
import { useNavigate } from "react-router-dom";

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    totalIssuedBooks: 0,
    totalTypes: 0,
  });
  const [genreStats, setGenreStats] = useState<any[]>([]);
  const [topReaders, setTopReaders] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    tong_luot_muon: 0,
    tong_luot_tra: 0,
  });
  const [sectionLoading, setSectionLoading] = useState({
    summary: true,
    weekly: true,
    genre: true,
    readers: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      setError(null);
      setSectionLoading({
        summary: true,
        weekly: true,
        genre: true,
        readers: true
      });

      // Fetch all reports in parallel
      const [
        totalBooks,
        totalStudents,
        totalIssuedBooks,
        totalTypes,
        genreData,
        topReadersData,
        weeklyData
      ] = await Promise.all([
        reportService.getTotalBook().catch(err => {
          console.error('Error fetching total books:', err);
          return { data: { total: 0 } };
        }),
        reportService.getTotalStudent().catch(err => {
          console.error('Error fetching total students:', err);
          return { data: { total: 0 } };
        }),
        reportService.getTotalIssuedBook().catch(err => {
          console.error('Error fetching total issued books:', err);
          return { data: { total: 0 } };
        }),
        reportService.getTotalTypeOfBooks().catch(err => {
          console.error('Error fetching total types:', err);
          return { data: { total: 0 } };
        }),
        reportService.getNumberBookByGenre().catch(err => {
          console.error('Error fetching genre data:', err);
          return { data: [] };
        }),
        reportService.getTopReader(5).catch(err => {
          console.error('Error fetching top readers:', err);
          return { data: [] };
        }),
        reportService.getIssueReturnBookWeek(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ).catch(err => {
          console.error('Error fetching weekly stats:', err);
          return { data: { tong_luot_muon: 0, tong_luot_tra: 0 } };
        })
      ]);

      setStats({
        totalBooks: totalBooks.data.total,
        totalStudents: totalStudents.data.total,
        totalIssuedBooks: totalIssuedBooks.data.total,
        totalTypes: totalTypes.data.total,
      });

      setGenreStats(genreData.data);
      setTopReaders(topReadersData.data);
      setWeeklyStats(weeklyData.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
      setSectionLoading({
        summary: false,
        weekly: false,
        genre: false,
        readers: false
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-[#033060] animate-spin mx-auto mb-4" />
          <p className="text-lg text-[#033060]">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#033060] mb-2">Error Loading Reports</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllReports}
            className="bg-[#033060] text-white px-6 py-2 rounded-lg hover:bg-[#024050] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="flex items-center mb-1">
          <BarChart2 className="h-12 w-12 text-[#033060] mr-3" />
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow text-center" style={{letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3'}}>
            Library Reports
          </h1>
        </div>
        <p className="text-gray-600 text-lg text-center">
          Comprehensive overview of library statistics and metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {sectionLoading.summary ? (
          <div className="col-span-4 flex justify-center items-center h-32">
            <RefreshCw className="h-8 w-8 text-[#033060] animate-spin" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[#033060] font-semibold text-sm md:text-base">Total Books</h3>
                <Book className="h-5 w-5 text-[#033060]" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-[#033060]">{stats.totalBooks}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[#033060] font-semibold text-sm md:text-base">Total Students</h3>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[#033060] font-semibold text-sm md:text-base">Issued Books</h3>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-red-600">{stats.totalIssuedBooks}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[#033060] font-semibold text-sm md:text-base">Book Types</h3>
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-600">{stats.totalTypes}</div>
            </div>
          </>
        )}
      </div>

      {/* Weekly Statistics */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-6 mb-6" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <h2 className="text-2xl font-bold text-[#033060] mb-4">Weekly Statistics</h2>
        {sectionLoading.weekly ? (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-8 w-8 text-[#033060] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f5f8fc] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#033060] mb-2">Total Borrows</h3>
              <p className="text-3xl font-bold text-blue-600">{weeklyStats.tong_luot_muon}</p>
            </div>
            <div className="bg-[#f5f8fc] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#033060] mb-2">Total Returns</h3>
              <p className="text-3xl font-bold text-green-600">{weeklyStats.tong_luot_tra}</p>
            </div>
          </div>
        )}
      </div>

      {/* Genre Distribution */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-6 mb-6" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <h2 className="text-2xl font-bold text-[#033060] mb-4">Books by Genre</h2>
        {sectionLoading.genre ? (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-8 w-8 text-[#033060] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Genre</th>
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base">Total Books</th>
                </tr>
              </thead>
              <tbody>
                {genreStats.map((genre) => (
                  <tr key={genre.id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                    <td className="py-3 px-5 text-left">{genre.genre}</td>
                    <td className="py-3 px-5 text-center">{genre.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Readers */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-6 mb-6" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <h2 className="text-2xl font-bold text-[#033060] mb-4">Top Readers</h2>
        {sectionLoading.readers ? (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-8 w-8 text-[#033060] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Student ID</th>
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Name</th>
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base">Books Borrowed</th>
                </tr>
              </thead>
              <tbody>
                {topReaders.map((reader) => (
                  <tr key={reader.student_id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                    <td className="py-3 px-5 text-left">{reader.student_id}</td>
                    <td className="py-3 px-5 text-left">{reader.name}</td>
                    <td className="py-3 px-5 text-center">{reader.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#f5f8fc] text-[#033060] border border-[#dbeafe] px-2 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-[#eaf3fb] transition-colors font-semibold text-sm md:text-base"
          style={{minWidth: '36px', minHeight: '36px'}}
          aria-label="Return to previous page"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden md:inline">Return</span>
        </button>
      </div>
    </div>
  );
}