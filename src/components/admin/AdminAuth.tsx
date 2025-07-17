import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';

interface AdminAuthProps {
  onAuthenticated: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mot de passe temporaire simple - à remplacer par une vraie authentification
  const ADMIN_PASSWORD = 'god-connect-admin-2024';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulation d'une vérification
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuthenticated', 'true');
        onAuthenticated();
      } else {
        setError('Mot de passe incorrect');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="text-purple-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Accès Administrateur
          </h1>
          <p className="text-white/70">
            Connectez-vous pour accéder au tableau de modération
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Mot de passe administrateur
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 pr-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none"
                placeholder="Entrez le mot de passe"
                required
              />
              <Lock className="absolute left-3 top-3.5 text-white/50" size={16} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!password || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Shield size={16} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-xs">
            <strong>Note de développement :</strong> Ceci est une authentification temporaire. 
            En production, intégrez un système d'authentification robuste avec Supabase Auth.
          </p>
        </div>
      </div>
    </div>
  );
}; 