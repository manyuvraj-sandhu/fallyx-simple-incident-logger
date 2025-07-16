import IncidentForm from './IncidentForm';
import IncidentList from './IncidentList';
import IncidentChart from './IncidentChart';

type Props = {
  user: any;
  refreshKey: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Dashboard({
  user,
  refreshKey,
  setRefreshKey,
  showForm,
  setShowForm,
}: Props) {
  return (
    <div className="z-10 w-full flex flex-col items-center px-4 py-6 space-y-6 text-center">
      <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-4">
        Seamlessly log, manage, and summarize incidents with AI-assisted support.
      </p>
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
        Hello, {user.displayName}
      </h2>

      <>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-cyan-900 hover:bg-cyan-950 text-white text-base px-6 py-2 rounded-md shadow-md transition-all"
        >
          {showForm ? 'Hide Form' : 'Report a New Incident'}
        </button>

        {showForm && (
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
            <IncidentForm
              user={user}
              onCreated={() => {
                setRefreshKey((k) => k + 1);
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* Chart Above Incident List */}
        <div className="w-full sm:w-11/12">
          <IncidentChart user={user} />
        </div>

        {/* Incident List */}
        <div className="w-full sm:w-11/12 mt-6">
          <IncidentList key={refreshKey} user={user} />
        </div>
      </>
    </div>
  );
}
