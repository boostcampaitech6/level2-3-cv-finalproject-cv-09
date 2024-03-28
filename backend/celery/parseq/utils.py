import numpy as np


def cal_sim(str1, str2):
    """
    Normalized Edit Distance metric (1-N.E.D specifically)
    """
    m = len(str1) + 1
    n = len(str2) + 1
    matrix = np.zeros((m, n))
    for i in range(m):
        matrix[i][0] = i
    for j in range(n):
        matrix[0][j] = j

    for i in range(1, m):
        for j in range(1, n):
            if str1[i - 1] == str2[j - 1]:
                matrix[i][j] = matrix[i - 1][j - 1]
            else:
                matrix[i][j] = min(matrix[i - 1][j - 1], min(matrix[i][j - 1], matrix[i - 1][j])) + 1
    lev = matrix[m-1][n-1]
    if (max(m-1, n-1)) == 0:
        sim = 1.0
    else:
        sim = 1.0-lev/(max(m-1, n-1))
    return sim
