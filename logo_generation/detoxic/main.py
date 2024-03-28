from detoxify import Detoxify


def check_toxic(text):
    i = 0
    result1 = Detoxify('original').predict(text)
    result2 = Detoxify('unbiased').predict(text)
    result3 = Detoxify('multilingual').predict(text)

    for r1 in result1.values():
        if r1 > 0.5:
            i += 1
            break
    for r2 in result2.values():
        if r2 > 0.5:
            i += 1
            break
    for r3 in result3.values():
        if r3 > 0.5:
            i += 1
            break

    if i >= 2:
        return True

    else:
        return False
