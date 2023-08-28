/**
 * 글자수 제한에 맞게 문자열을 잘라주는 함수
 * @param {string} str - 처리할 문자열
 * @param {number} limit - 최대 글자수
 * @returns {string} 처리된 문자열
*/
module.exports = (str, limit) => {
    return str.length > limit ? str.substring(0, limit - 3) + "..." : str;
}