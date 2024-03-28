# 구글 번역기 api 요청시 비주기적으로 끊기는 현상으로 인해 sh파일로 자동 반복실행.
NUM_RUNS=100

PYTHON_SCRIPT="/workspace/logo_gen_project/AIHub_ko2en.py"

for i in $(seq 1 $NUM_RUNS)
do
    echo "Running iteration $i"
    python3 $PYTHON_SCRIPT
done