-- запрос: buhta/core-tests/schema/СписокОрганизаций.query.json

/************** SQL-before: начало **************/
ALTER  PROCEDURE [dbo].[Export_Add_Subconto]
  @SubcontoNum VARCHAR(32), 
  @SubcontoName VARCHAR(50), 
  @SubcontoID INT OUTPUT , 
  @SubcontoType VARCHAR(5) OUTPUT
AS
BEGIN
  --Используется для экспорта документов в DBF-формате из "Бизнес-софт"
  --Режим реализован ввиде карточки пользователя
  DECLARE @s VARCHAR(32)={{"нет"}}
  SET @SubcontoID=ISNULL((SELECT Top 1 SubcontoID FROM #CashTable WHERE Number=@SubcontoNum AND SubcontoType=@SubcontoType),0)
  IF @SubcontoID=0
END  
/************** SQL-before: конец  **************/

SELECT
    [Организация].[Номер] AS [Номер],
    [Организация].[Название] AS [Название],
    [Организация.Сотрудник].[Номер] AS [ДирНомер178],
    [Организация.Сотрудник].[Фамилия] AS [Дир-Фамилия],
    [Организация.Сотрудник].[Отчество] AS [Отчество],
    [Организация.Сотрудник].[ИНН] AS [ИНН],
    [Организация.Сотрудник].[ДатаРождения] AS [Рожд],
    [Организация].[ИНН] AS [ИНН],
    [Организация].[Ключ] AS [Ключ],
    [Организация].[Ключ] AS [__recordId__]
FROM
    [buhta_core_tests_schema_Организация] AS [Организация]
    LEFT JOIN [СотрXXX] AS [Организация.Сотрудник]
    ON [Организация].[Директор]=[Организация.Сотрудник].[Ключ]

