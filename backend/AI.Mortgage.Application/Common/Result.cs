namespace AI.Mortgage.Application.Common;

public sealed class Result<T>
{
    public Result(T? value, bool isSuccess, string? error = null)
    {
        Value = value;
        IsSuccess = isSuccess;
        Error = error;
    }

    public T? Value { get; }
    public bool IsSuccess { get; }
    public string? Error { get; }

    public static Result<T> Success(T value) => new(value, true);
    public static Result<T> Failure(string error) => new(default, false, error);
}
