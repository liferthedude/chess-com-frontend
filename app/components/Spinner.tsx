export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '2.5px solid rgba(124, 58, 237, 0.2)',
          borderTopColor: '#7c3aed',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
