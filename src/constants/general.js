export const STACK_MAX_LENGTH = 150;
export const STACK_MAX_WORD_LENGTH = 31;
export const NICKNAME_MAX_LENGTH = 31;
export const NAME_MAX_LENGTH = 99;
export const VALID_PEOPLE_COUNT = 2 * 1000;
export const BAD_PEOPLE_COUNT = VALID_PEOPLE_COUNT * 10;
export const UNPROCESSABLE_PEOPLE_COUNT = BAD_PEOPLE_COUNT * 3;
export const UNSEARCHABLE_TERMS_COUNT = 10 * 1000;

export const HTTP_STATUS_CODE_POINTS = {
  201: 10,
  400: 2,
  422: 3,
  200: 5,
  404: 1,
  unknown: 1,
};

export const SEARCH_EXECUTION_RPS = 1000;
