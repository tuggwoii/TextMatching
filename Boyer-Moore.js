var badchar = [ ];

function badCharHeuristic(pattern, size) {
    badchar = new Array(size);
	var  i;
    // Initialize all occurrences as -1
    for (i = 0; i < size; i++) {
		 badchar[i] = -1;
	}
    for (i = 0; i < pattern.length; i++) {
		 badchar[pattern[i].toLowerCase()] = i;
	}
}

exports.search = function(pattern, text) {
	badCharHeuristic(pattern, text.length);
	var textLength = text.length;
	var patternLength = pattern.length;
	var textIndex = 0 , patternIndex;
    while (textIndex <= textLength - patternLength) {
        var patternIndex = patternLength - 1;
        while (patternIndex >= 0) {
			if(pattern[patternIndex].toLowerCase() == text[patternIndex + textIndex].toLowerCase()) {
				patternIndex--;
				if (patternIndex < 0) {
					return textIndex;
				} 
			}
			else {
				var skip = isNaN(patternIndex - badchar[text[textIndex + patternIndex]])? -1: (patternIndex - badchar[text[textIndex + patternIndex]])
				var jump = Math.max(1, skip);
				textIndex += jump;
				patternIndex = -1;
			}
		}
    }
	return -1;
} 