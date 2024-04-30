import { useDebouncedCallback } from "use-debounce";
import { StringParam, useQueryParams, withDefault } from "use-query-params";

interface UseSearchStateProps {
  initialValue?: string;
  debounce?: number;
}

interface SearchState {
  search: string;
  debounceSearch: (search: string) => void;
}

export function useSearchState({
  initialValue = "",
  debounce = 500,
}: UseSearchStateProps = {}): SearchState {
  const [query, setQuery] = useQueryParams({
    search: withDefault(StringParam, initialValue),
  });

  const debounceSearch = useDebouncedCallback((value) => {
    setQuery({ search: value });
  }, debounce);

  return {
    search: query.search,
    debounceSearch,
  };
}
