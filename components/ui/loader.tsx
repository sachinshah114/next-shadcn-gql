export function Loader() {
    return (
        <div className="loader">
            <style jsx>{`
          .loader {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border-left-color: #3498db;
            animation: spin 1s linear infinite;
          }
  
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        </div>
    );
}