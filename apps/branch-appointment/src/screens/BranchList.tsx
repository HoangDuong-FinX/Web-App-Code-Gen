// Screen: branch-list — Browse branches with province/city filter
import React, { useState, useEffect, useCallback } from 'react';
import { t } from '../i18n';
import { apiRequest } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import type { Branch } from '../types';

interface BranchListProps {
  onSelectBranch: (branch: Branch) => void;
  onNavigateToMyAppointments: () => void;
}

const PROVINCES = [
  'H\u00e0 N\u1ed9i',
  'H\u1ed3 Ch\u00ed Minh',
  '\u0110\u00e0 N\u1eb5ng',
  'H\u1ea3i Ph\u00f2ng',
  'C\u1ea7n Th\u01a1',
  'Bi\u00ean H\u00f2a',
  'Hu\u1ebf',
  'Nha Trang',
];

export const BranchList: React.FC<BranchListProps> = ({ onSelectBranch, onNavigateToMyAppointments }) => {
  const [province, setProvince] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const loadBranches = useCallback(async (selectedProvince: string) => {
    setLoading(true);
    setError(false);
    try {
      const queryParam = selectedProvince ? `?province=${encodeURIComponent(selectedProvince)}` : '';
      const data = await apiRequest<{ branches: Branch[] }>({
        method: 'GET',
        path: `/branches${queryParam}`,
      });
      setBranches(data.branches);
    } catch {
      setError(true);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches(province);
  }, [province, loadBranches]);

  const filteredBranches = searchText.trim()
    ? branches.filter((b) =>
        b.name.toLowerCase().includes(searchText.trim().toLowerCase())
      )
    : branches;

  return (
    <div className="stack-col gap-4">
      <h1 className="text-title">{t('branchList.title')}</h1>

      <div className="form-group">
        <label className="form-label" htmlFor="province-filter">
          {t('branchList.filterLabel')}
        </label>
        <select
          id="province-filter"
          className="form-select"
          aria-label={t('branchList.filterLabel')}
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        >
          <option value="">{t('branchList.filterAll')}</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="branch-search">
          {t('branchList.searchLabel')}
        </label>
        <input
          id="branch-search"
          className="form-input"
          type="search"
          aria-label={t('branchList.searchPlaceholder')}
          placeholder={t('branchList.searchPlaceholder')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loading-container" role="status" aria-label={t('common.loading')}>
          <div className="spinner" />
        </div>
      )}

      {error && !loading && (
        <ErrorState
          title={t('branchList.errorTitle')}
          description={t('branchList.errorDescription')}
          retryLabel={t('branchList.retry')}
          onRetry={() => loadBranches(province)}
          ariaLabel={t('branchList.errorTitle')}
        />
      )}

      {!loading && !error && filteredBranches.length === 0 && (
        <EmptyState
          title={t('branchList.emptyTitle')}
          description={t('branchList.emptyDescription')}
          ariaLabel={t('branchList.emptyTitle')}
        />
      )}

      {!loading && !error && filteredBranches.length > 0 && (
        <div className="stack-col gap-3" role="list" aria-label={t('branchList.title')}>
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="card card-interactive"
              role="listitem"
              tabIndex={0}
              aria-label={`${branch.name}, ${branch.address}`}
              onClick={() => onSelectBranch(branch)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectBranch(branch);
                }
              }}
            >
              <div className="stack-col gap-1">
                <span className="text-subtitle">{branch.name}</span>
                <span className="text-caption text-secondary">{branch.address}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="text-link"
        aria-label={t('branchList.viewMyAppointments')}
        onClick={onNavigateToMyAppointments}
      >
        {t('branchList.viewMyAppointments')}
      </button>
    </div>
  );
};
